import classnames from 'classnames';

import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const EditorTabs = ( {
	EDITOR_MAP,
	count,
	onlyProSites,
	editor,
	setCurrentEditor,
	sites,
} ) => {
	const editorsOrderedFromAPI = Object.keys( sites );
	return (
		<div className="editor-tabs">
			{ editorsOrderedFromAPI.map( ( key, index ) => {
				const classes = classnames( [
					'tab',
					key,
					{ active: key === editor },
				] );
				return (
					<a
						key={ index }
						href="#"
						className={ classes }
						onClick={ ( e ) => {
							e.preventDefault();
							setCurrentEditor( key );
						} }
					>
						<span className="icon-wrap">
							<img
								className="editor-icon"
								src={
									cossDash.assets +
									'img/' +
									EDITOR_MAP[ key ].icon
								}
								alt={ __(
									'Builder Logo',
									'codeless-starter-sites'
								) }
							/>
						</span>
						<span className="editor">
							{ EDITOR_MAP[ key ].niceName }
						</span>
						<span className="count">{ count[ key ] }</span>
						{ onlyProSites.includes( key ) && (
							<span className="pro-badge">PRO</span>
						) }
					</a>
				);
			} ) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentEditor, getSites } = select( 'codeless-ss' );
		return {
			editor: getCurrentEditor(),
			sites: getSites().sites,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentEditor } = dispatch( 'codeless-ss' );
		return {
			setCurrentEditor: ( editor ) => setCurrentEditor( editor ),
		};
	} )
)( EditorTabs );
