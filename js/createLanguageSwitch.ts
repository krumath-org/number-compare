// Copyright 2026, University of Colorado Boulder

/**
 * Khmer / English language switch (segmented pair). Style matches center-and-variability.
 *
 * @author KruMath localization
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import localeProperty from '../../joist/js/i18n/localeProperty.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';

const SELECTED_COLOR = '#087e73';
const UNSELECTED_COLOR = '#37464a';

export default function createLanguageSwitch( tandemNamePrefix = 'languageSwitch' ): HBox {
  const createLanguageButton = ( label: string, locale: 'km' | 'en', segment: 'left' | 'right' ): TextPushButton => {
    const isLeftSegment = segment === 'left';
    const selectedProperty = new DerivedProperty( [ localeProperty ], currentLocale => currentLocale === locale, {
      tandem: Tandem.OPT_OUT
    } );

    return new TextPushButton( label, {
      font: new PhetFont( { family: 'Kantumruy Pro', size: 16, weight: 'bold' } ),
      textFill: 'white',
      minWidth: 78,
      minHeight: 38,
      xMargin: 12,
      yMargin: 7,
      baseColor: localeProperty.value === locale ? SELECTED_COLOR : UNSELECTED_COLOR,
      stroke: '#9aafb0',
      lineWidth: 1,
      cornerRadius: 0,
      leftTopCornerRadius: isLeftSegment ? 8 : 0,
      leftBottomCornerRadius: isLeftSegment ? 8 : 0,
      rightTopCornerRadius: isLeftSegment ? 0 : 8,
      rightBottomCornerRadius: isLeftSegment ? 0 : 8,
      accessibleRoleConfiguration: 'toggle',
      accessiblePressedProperty: selectedProperty,
      listener: () => { localeProperty.value = locale; },
      tandem: Tandem.ROOT.createTandem( `${tandemNamePrefix}${locale === 'km' ? 'Khmer' : 'English'}` )
    } );
  };

  const khmerButton = createLanguageButton( 'ខ្មែរ', 'km', 'left' );
  const englishButton = createLanguageButton( 'English', 'en', 'right' );

  localeProperty.link( locale => {
    khmerButton.baseColor = locale === 'km' ? SELECTED_COLOR : UNSELECTED_COLOR;
    englishButton.baseColor = locale === 'en' ? SELECTED_COLOR : UNSELECTED_COLOR;
  } );

  return new HBox( { children: [ khmerButton, englishButton ], spacing: 0 } );
}
