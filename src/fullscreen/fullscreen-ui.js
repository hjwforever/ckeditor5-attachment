import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

import fullscreenIcon from './theme/icons/fullscreen.svg'
import './theme/fullscreen.css'

export default class FullscreenUI extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'FullscreenUI'
  }

  init() {
    const editor = this.editor
    const componentFactory = editor.ui.componentFactory

    componentFactory.add('fullscreen', (locale) => {
      const command = editor.commands.get('fullscreen')
      const view = new ButtonView(locale)

      view.set({
        label: '全屏',
        icon: fullscreenIcon,
        keystroke: 'CTRL+Q',
        tooltip: true,
      })

      view.bind('isEnabled').to(command, 'isEnabled')

      this.listenTo(view, 'execute', () => {
        editor.execute('fullscreen')
        editor.editing.view.focus()
      })

      return view
    })
  }
}
