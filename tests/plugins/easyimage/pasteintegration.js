/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar, clipboard */

( function() {
	'use strict';

	var IMG = {
		JPEG: '<img src="data:image/jpeg;base64,foo">',
		GIF: '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">',
		PNG: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=">',
		BMP: '<img src="data:image/bmp;base64,foo">',
		SVG: '<img src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E">'
	};

	bender.editor = true;

	function assertEasyImageUpcast( config ) {
		var editor = config.editor,
			pastedData = config.pastedData,
			shouldUpcast = config.shouldUpcast,
			// spy checks if paste listener in easyimage plugin activates an early return,
			// by spying the method available after the early return statement.
			spy = sinon.spy( editor.widgets.registered.easyimage, '_spawnLoader' );

		bender.tools.range.setWithHtml( editor.editable(), '<p>[]</p>' );

		bender.tools.emulatePaste( editor, pastedData );

		editor.once( 'afterPaste', function() {
			resume( function() {
				spy.restore();

				if ( shouldUpcast ) {
					sinon.assert.calledOnce( spy );

					assert.areNotSame( -1, editor.getData().indexOf( 'easyimage' ), 'there should be the image upcasted to the easyimage widget' );
				} else {
					sinon.assert.notCalled( spy );

					assert.areSame( -1, editor.getData().indexOf( 'easyimage' ), 'there should not be an image upcasted to the easyimage widget' );
				}
			} );
		} );

		wait();
	}

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test easyimage upcasts image/jpeg': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.JPEG,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/gif': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.GIF,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/png': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.PNG,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/bmp': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.BMP,
				shouldUpcast: true
			} );
		},

		'test easyimage not upcasts image/svg': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.SVG,
				shouldUpcast: false
			} );
		}
	} );
} )();
