import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'

import FullscreenCommand from './fullscreen-command'

export default class FullscreenEditing extends Plugin {
  static get requires() {
    return [Widget]
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'FullscreenEditing'
  }

  init() {
    this.editor.commands.add('fullscreen', new FullscreenCommand(this.editor))
    // this.editor.config.define('attachmentConfig', {
    //   // ADDED
    //   types: ['date', 'first name', 'surname'],
    // })
  }
}
