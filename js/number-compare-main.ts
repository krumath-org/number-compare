// Copyright 2019-2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

// Must be first: sets Kantumruy Pro before any PhetFont is constructed at import time.
import './applyKantumruyFontFamily.js';

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import audioManager from '../../joist/js/audioManager.js';
import localeProperty from '../../joist/js/i18n/localeProperty.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import AutoHearControl from '../../number-suite-common/js/common/view/AutoHearControl.js';
import LanguageAndVoiceControl from '../../number-suite-common/js/common/view/LanguageAndVoiceControl.js';
import NumberSuiteCommonPreferencesNode from '../../number-suite-common/js/common/view/NumberSuiteCommonPreferencesNode.js';
import LabScreen from '../../number-suite-common/js/lab/LabScreen.js';
import { combineOptions } from '../../phet-core/js/optionize.js';
import MathSymbols from '../../scenery-phet/js/MathSymbols.js';
import DisplayGlobals from '../../scenery/js/display/DisplayGlobals.js';
import isSettingPhetioStateProperty from '../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../tandem/js/Tandem.js';
import SpeechSynthesisAnnouncer from '../../utterance-queue/js/SpeechSynthesisAnnouncer.js';
import numberComparePreferences from './common/model/numberComparePreferences.js';
import NumberComparePreferencesNode from './common/view/NumberComparePreferencesNode.js';
import numberCompareSpeechSynthesisAnnouncer from './common/view/numberCompareSpeechSynthesisAnnouncer.js';
import numberCompareUtteranceQueue from './common/view/numberCompareUtteranceQueue.js';
import CompareScreen from './compare/CompareScreen.js';
import createLanguageSwitch from './createLanguageSwitch.js';
import NumberCompareStrings from './NumberCompareStrings.js';

const numberCompareTitleStringProperty = NumberCompareStrings[ 'number-compare' ].titleStringProperty;
const LAB_SCREEN_SYMBOLS = [ MathSymbols.LESS_THAN, MathSymbols.GREATER_THAN, MathSymbols.EQUAL_TO, MathSymbols.PLUS, MathSymbols.MINUS ];

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Klusendorf, Luisa Vargas',
    team: 'Sylvia Celedón-Pattichis, Michael Kauzmann, Chris Malley (PixelZoom, Inc.), Ariel Paul, Kathy Perkins, Marla Schulz, Ian Whitacre',
    qualityAssurance: 'Clifford Hardin, Emily Miller, Nancy Salpepi, Martin Veillette, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer',
    thanks: 'Andrea Barraugh (Math Transformations), Kristin Donley, Bertha Orona'
  },
  preferencesModel: new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: () => new NumberComparePreferencesNode()
      } ]
    },
    audioOptions: {
      customPreferences: [ {
        createContent: () => new AutoHearControl(
          numberComparePreferences.autoHearEnabledProperty,
          numberCompareSpeechSynthesisAnnouncer.hasVoiceProperty,
          NumberCompareStrings.automaticallyHearNumberSentenceStringProperty,
          NumberCompareStrings.automaticallyHearNumberSentenceDescriptionStringProperty,
          {
            visible: NumberSuiteCommonPreferencesNode.hasScreenType( CompareScreen )
          } )
      } ],

      // speech synthesis is the only sound used in this sim, no general sim sounds
      supportsSound: false
    },
    localizationOptions: {
      includeLocalePanel: false,
      customPreferences: [ {
        createContent: () => new LanguageAndVoiceControl(
          localeProperty,
          numberComparePreferences.primaryVoiceProperty,
          numberCompareUtteranceQueue
        )
      } ]
    }
  } )
};

const launchSimulation = (): void => {
  localeProperty.value = 'km';

  const sim = new Sim( numberCompareTitleStringProperty, [
    new CompareScreen( Tandem.ROOT.createTandem( 'compareScreen' ) ),
    new LabScreen( LAB_SCREEN_SYMBOLS, numberComparePreferences, Tandem.ROOT.createTandem( 'numberCompareLabScreen' ) )
  ], combineOptions<SimOptions>( {}, simOptions, {
    homeScreenWarningNode: createLanguageSwitch()
  } ) );
  sim.start();

  if ( SpeechSynthesisAnnouncer.isSpeechSynthesisSupported() ) {
    numberCompareSpeechSynthesisAnnouncer.initialize( DisplayGlobals.userGestureEmitter, {
      speechAllowedProperty: new DerivedProperty( [
        sim.isConstructionCompleteProperty,
        sim.browserTabVisibleProperty,
        sim.activeProperty,
        isSettingPhetioStateProperty,
        audioManager.audioEnabledProperty
      ], ( simConstructionComplete, simVisible, simActive, simSettingPhetioState, audioEnabled ) => {
        return simConstructionComplete && simVisible && simActive && !simSettingPhetioState && audioEnabled;
      } )
    } );
    numberCompareSpeechSynthesisAnnouncer.enabledProperty.value = true;
  }

  numberCompareUtteranceQueue.initialize( sim.selectedScreenProperty );
};

const kantumruyFont = new FontFace(
  'Kantumruy Pro',
  `url(${new URL( 'images/KantumruyProKhmer.woff2', window.location.href )})`,
  { weight: '100 900' }
);

kantumruyFont.load().then( loadedFont => {
  document.fonts.add( loadedFont );
  simLauncher.launch( launchSimulation );
} ).catch( error => {
  console.error( 'Unable to load Kantumruy Pro; using the default font.', error );
  simLauncher.launch( launchSimulation );
} );
