// Copyright 2026, University of Colorado Boulder

/**
 * Apply Kantumruy Pro as the sim-wide PhetFont family before other modules load.
 *
 * @author KruMath localization
 */

import HomeScreenView from '../../joist/js/HomeScreenView.js';
import sceneryPhetQueryParameters from '../../scenery-phet/js/sceneryPhetQueryParameters.js';

sceneryPhetQueryParameters.fontFamily = 'Kantumruy Pro';

( HomeScreenView as unknown as { TITLE_FONT_FAMILY: string } ).TITLE_FONT_FAMILY = 'Kantumruy Pro';
