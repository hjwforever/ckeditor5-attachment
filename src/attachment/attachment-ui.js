import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { SplitButtonView, createDropdown } from 'ckeditor5/src/ui'

// import { FileDialogButtonView } from 'ckeditor5/src/upload'
import AttachmentFormView from './ui/attachmentFormView'

import attachmentIcon from './theme/icons/attachment.svg'
import './theme/attachment.css'

export default class AttachmentUI extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'AttachmentUI'
  }

  init() {
    const editor = this.editor
    const t = editor.t
    const componentFactory = editor.ui.componentFactory

    componentFactory.add('attachment', (locale) => {
      const command = editor.commands.get('attachment')
      const dropdownView = createDropdown(locale, SplitButtonView)
      const attachmentFormView = new AttachmentFormView(getFormValidators(t), editor.locale)

      this._setUpDropdown(dropdownView, attachmentFormView, command, editor)
      this._setUpForm(dropdownView, attachmentFormView, command)

      return dropdownView
    })
  }

  /**
   * @private
   * @param {module:ui/dropdown/dropdownview~DropdownView} dropdown
   * @param {module:ui/view~View} form
   * @param {module:media-embed/mediaembedcommand~MediaEmbedCommand} command
   */
  _setUpDropdown(dropdown, form, command) {
    const editor = this.editor
    const t = editor.t
    const button = dropdown.buttonView

    dropdown.bind('isEnabled').to(command)
    dropdown.panelView.children.add(form)

    button.set({
      label: t('插入附件'),
      icon: attachmentIcon,
      tooltip: true,
      isToggleable: true,
    })

    // Note: Use the low priority to make sure the following listener starts working after the
    // default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
    // invisible form/input cannot be focused/selected.
    button.on(
      'open',
      () => {
        form.disableCssTransitions()

        // Make sure that each time the panel shows up, the URL field remains in sync with the value of
        // the command. If the user typed in the input, then canceled (`urlInputView#fieldView#value` stays
        // unaltered) and re-opened it without changing the value of the media command (e.g. because they
        // didn't change the selection), they would see the old value instead of the actual value of the
        // command.
        form.url = command.value || ''
        form.urlInputView.fieldView.select()
        form.enableCssTransitions()
      },
      { priority: 'low' }
    )

    button.on('execute', async () => {
      const files = await this._openFile()
      editor.execute('attachment', {
        files,
        type: 'upload',
      })
      editor.editing.view.focus()
    })

    dropdown.on('submit', () => {
      if (form.isValid()) {
        editor.execute('attachment', {
          url: form.url || 'https://example.com/test-splitButtonView2.pdf',
          type: 'insert',
        })
        editor.editing.view.focus()
        dropdown.isOpen = false
      }
    })

    dropdown.on('cancel', () => {
      editor.editing.view.focus()
      dropdown.isOpen = false
    })
    dropdown.on('change:isOpen', () => form.resetFormStatus())
  }

  /**
   * @private
   * @param {module:ui/dropdown/dropdownview~DropdownView} dropdown
   * @param {module:ui/view~View} form
   * @param {module:media-embed/mediaembedcommand~MediaEmbedCommand} command
   */
  _setUpForm(dropdown, form, command) {
    form.delegate('submit', 'cancel').to(dropdown)
    form.urlInputView.bind('url').to(command, 'url')

    // Form elements should be read-only when corresponding commands are disabled.
    form.urlInputView.bind('isReadOnly').to(command, 'isEnabled', (value) => !value)
  }
  _downloadFile(value) {
    value && window.open(value, '_blank')
  }

  async _openFile() {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.addEventListener('change', () => {
        // console.log('input', input, input.files)
        // resolve(input.files[0])
        resolve(input.files) // resolve array of files
      })
      input.click()
    })
  }
}

function getFormValidators(t) {
  return [
    (form) => {
      if (!form.url.length) {
        return t('附件地址不能为空')
      }
    },
    (form) => {
      const regex = /https?:\/\/.+/
      if (!regex.test(form.url)) {
        return t('附件地址格式不正确')
      }
    },
  ]
}

/**
 * Creates a regular expression used to test for image files.
 *
 *		const imageType = createImageTypeRegExp( [ 'png', 'jpeg', 'svg+xml', 'vnd.microsoft.icon' ] );
 *
 *		console.log( 'is supported image', imageType.test( file.type ) );
 *
 * @param {Array.<String>} types
 * @returns {RegExp}
 */
export function createImageTypeRegExp(types) {
  // Sanitize the MIME type name which may include: "+", "-" or ".".
  const regExpSafeNames = types.map((type) => type.replace('+', '\\+'))

  return new RegExp(`^image\\/(${regExpSafeNames.join('|')})$`)
}
