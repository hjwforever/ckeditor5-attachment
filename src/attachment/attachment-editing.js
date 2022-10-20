// placeholder/placeholderediting.js

import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'

import AttachmentCommand from './attachment-command'

import './theme/attachment.css'

export default class AttachmentEditing extends Plugin {
  static get requires() {
    return [Widget]
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'AttachmentEditing'
  }

  init() {
    // console.log('AttachmentEditing#init() got called')

    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('attachment', new AttachmentCommand(this.editor))

    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) => viewElement.hasClass('attachment'))
    )

    // this.editor.config.define('attachmentConfig', {
    //   // ADDED
    //   types: ['date', 'first name', 'surname'],
    // })
  }

  _defineSchema() {
    // ADDED
    const schema = this.editor.model.schema

    //  https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_schema-SchemaItemDefinition.html#member-allowAttributes
    schema.register('attachment', {
      // Allow wherever text is allowed:
      allowWhere: '$text',

      // The attachment will act as an inline node:
      isInline: true,

      // The inline widget is self-contained so it cannot be split by the caret and can be selected:
      isObject: true,

      // The inline widget can have the same attributes as text (for example linkHref, bold).
      allowAttributesOf: '$text',

      // The placeholder can have many types, like date, name, surname, etc:
      allowAttributes: ['fileName', 'url'],
    })
  }

  _defineConverters() {
    // ADDED
    const conversion = this.editor.conversion

    conversion.for('upcast').elementToElement({
      view: {
        name: 'a',
        classes: ['attachment'],
        download: true,
      },
      model: (viewElement, { writer: modelWriter }) => {
        const fileName = viewElement.getAttribute('fileName')
        const url = viewElement.getAttribute('url')
        // console.log('upcast', { viewElement }, url, fileName)
        return modelWriter.createElement('attachment', { url, fileName })
      },
    })

    conversion.for('editingDowncast').elementToElement({
      model: {
        name: 'attachment',
        attributes: ['url'],
      },
      view: (modelItem, { writer: viewWriter }) => {
        // console.log('editingDowncast', { modelItem })
        const widgetElement = createPlaceholderView(modelItem, viewWriter)

        // Enable widget handling on a placeholder element inside the editing view.
        return toWidget(widgetElement, viewWriter)
      },
    })

    conversion.for('dataDowncast').elementToElement({
      model: {
        name: 'attachment',
        attributes: ['url'],
      },
      view: (modelItem, { writer: viewWriter }) => {
        // console.log('dataDowncast', { modelItem })
        const element = createPlaceholderView(modelItem, viewWriter)
        return element
      },
    })

    // Helper method for both downcast converters.
    function createPlaceholderView(modelItem, viewWriter) {
      const fileName = modelItem.getAttribute('fileName')
      const nameArr = fileName?.split('.') || ['']
      const prefixName = nameArr.slice(0, nameArr.length - 1).join('.')
      const url = modelItem.getAttribute('url')
      // console.log('createPlaceholderView', { fileName, url })

      const placeholderView = viewWriter.createContainerElement(
        'a',
        { class: 'attachment', href: url, fileName, download: prefixName, url },
        [
          viewWriter.createAttributeElement('img', {
            class: 'attachment-icon',
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAv5JREFUWEetl1nITVEUx3/fo5LkyRQeFA+SIS8eZHhQimRKMhMSoogyR5QxMs9DkplQEhFvxihCKUWkpCTP9P9a+1p3f2efe869367T3Xeftdf/v9e012mi9cZQYDzQBxgIfANeAO+BDSmYplbCX58HAnwFFgNXY7zWIHABmBQpfg10A9pH64OAZ36tUQLngClO4XVgC/DU1iYCF937N+aiylIjBM4A05xy+XljwqV/3bpkKjFRL4GTwMyU0gwSY4Abtn4NGBdk6iFwFJhbAjyI/gLaAR+BnvUSOATML2j22BCvgL7AbyPS/L6MBfYDC3NOrlS8BLzNcIGi/4mtPwSGlbXAHmBJDriCSgQU5UrJmIT8Ptb277OaUNgCu4BlBcCDSFWUGzFfCXV6WaEQge3A8hLgcSquBjbnBWxeDGwFVtXwuT9ZfHLtlY4wFB9xxUwGoViLfVGzxuCymqyXC57KAilb1wC44kVxUxM8i8Bs4HgJn8cnV6YoYwqBxwR6A/eBzrY7Vh5SLeUW1QjVisLgMQEFyQTbfQqY5ZTVAp8HHC4L7gnocrhiCj5ZpdKvxlJgd45b5gDHcsDzKmQlC3zUrwS2mcJ+wAPXWMRumQHIWimzh04pVSErBG4Do0zLaOCWzX2rpeZjqgPT/GwB8FTMNK+HQqSerZNJKgjVUGro9Go2NXwJnQycLwGebFYCgS9AF1PYEfhu8wXAQZurfh8AutcoMnGDGrvN8f5vAQVg6FJGAndNqq211SE1qzbb9evLaylw74I1wCbTvgLY4ZAGAzeBDhH6kYzmRARyfR6fILhAd7XubI0fQC/gpxNuY23YcOCDdbrP3fvSJw97/W14B5D5NR4DQ2K2if91g3sXaN4V+OxAlN+LgD8J4B7WbJTpjluoivuB6cBpJ6VquBd4BAST67tP1tHFIxKlfJ6KAb8+AriXcWqlarCUf60ashY4UdBlVWKpjkgRvzP6+MjSf9nA39UDHsdAlg7VhgFAf3sk89IefXq3+NotS+QfmNG0IS7jBhcAAAAASUVORK5CYII=',
          }),
          viewWriter.createText(fileName),
        ],
        { renderUnsafeAttributes: ['download'] }
      )
      return placeholderView
    }
  }
}
