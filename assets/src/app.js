import './style.scss';
import reducer from './store/reducer';
import actions from './store/actions';
import selectors from './store/selectors';
import App from './Components/App';
import { registerStore } from '@wordpress/data';
import { render } from '@wordpress/element';

registerStore( 'codeless-ss', {
	reducer,
	actions,
	selectors,
} );

render( <App />, document.getElementById( 'coss-app' ) );
