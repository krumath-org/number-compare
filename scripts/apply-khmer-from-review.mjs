/**
 * One-shot: apply khmer-translation-review.json → babel *-strings_km.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '../..' );
const reviewPath = path.join( root, 'number-compare', 'khmer-translation-review.json' );
const review = JSON.parse( fs.readFileSync( reviewPath, 'utf8' ) );

const toBabelFlat = entries => {
  const out = {};
  for ( const [ key, { khmer } ] of Object.entries( entries ) ) {
    if ( !khmer && khmer !== '' ) {
      throw new Error( `Missing khmer for key: ${key}` );
    }
    out[ key ] = { value: khmer };
  }
  return out;
};

const toBabelNumberSuiteCommon = ( flatEntries, a11yEntries ) => {
  const out = toBabelFlat( flatEntries );
  if ( Object.keys( a11yEntries ).length > 0 ) {
    out.a11y = {};
    for ( const [ key, { khmer } ] of Object.entries( a11yEntries ) ) {
      const sub = key.replace( /^a11y\./, '' ).split( '.' );
      let cur = out.a11y;
      for ( let i = 0; i < sub.length - 1; i++ ) {
        cur[ sub[ i ] ] = cur[ sub[ i ] ] || {};
        cur = cur[ sub[ i ] ];
      }
      cur[ sub[ sub.length - 1 ] ] = { value: khmer };
    }
  }
  return out;
};

const writeBabel = ( repo, fileName, obj ) => {
  const dir = path.join( root, 'babel', repo );
  fs.mkdirSync( dir, { recursive: true } );
  const filePath = path.join( dir, fileName );
  fs.writeFileSync( filePath, `${JSON.stringify( obj, null, 2 )}\n`, 'utf8' );
  console.log( 'Wrote', filePath );
};

// number-compare
writeBabel( 'number-compare', 'number-compare-strings_km.json', toBabelFlat( review.sim_visible_ui ) );

// number-suite-common
const suiteFlat = {};
const suiteA11y = {};
for ( const [ key, val ] of Object.entries( review.suite_common_visible_ui ) ) {
  suiteFlat[ key ] = val;
}
for ( const [ key, val ] of Object.entries( review.suite_common_a11y_optional ) ) {
  suiteA11y[ key ] = val;
}
writeBabel( 'number-suite-common', 'number-suite-common-strings_km.json', toBabelNumberSuiteCommon( suiteFlat, suiteA11y ) );

// joist + scenery-phet (merge into existing scenery-phet km)
writeBabel( 'joist', 'joist-strings_km.json', toBabelFlat( review.shared_joist_chrome ) );

const sceneryPath = path.join( root, 'babel', 'scenery-phet', 'scenery-phet-strings_km.json' );
let sceneryKm = {};
if ( fs.existsSync( sceneryPath ) ) {
  sceneryKm = JSON.parse( fs.readFileSync( sceneryPath, 'utf8' ) );
}
Object.assign( sceneryKm, toBabelFlat( review.shared_scenery_phet_chrome ) );
writeBabel( 'scenery-phet', 'scenery-phet-strings_km.json', sceneryKm );

console.log( 'Done applying Khmer strings.' );
