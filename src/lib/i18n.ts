import { mapValues } from 'lodash'
import { createI18n, useI18n } from 'vue-i18n'

const i18nText = {
  successTip: 'Done',
  deletedTip: 'Deleted',
  appDeletedTip: 'App <{0}> Deleted',
  actionUndoTip: 'This action cannot be undo.',
  selectKiwiApp: 'Select a Kiwi App',
  logoutTip: 'Confirm logout?',
  confirmDeleteApp: 'Confirm delete this app?',
  confirmDeleteRecord: 'Confirm delete this record?',
  selectObjectTip: 'Select an object from the left menu to start',
  recordDetailTitle: 'Record Detail',
  createRecordTitle: 'Create Record',
  editRecordTitle: 'Edit Record',
  isRequired: '{0} is required',
  loginLabel: 'Login as Demo',
  excuteLabel: 'Excute',
  openLabel: 'Open',
  logoutLabel: 'Logout',
  createLabel: 'Create',
  addLabel: 'Add',
  refreshLabel: 'Refresh',
  cancelLabel: 'Cancel',
  clearLabel: 'Clear',
  removeLabel: 'Remove',
  confirmLabel: 'Confirm',
  submitLabel: 'Submit',
  okLabel: 'OK',
  placeholderSearchKeyword: 'Input keyword to search',
  placeholderSelect: 'Please select',
  placeholderEnter: 'Please enter',
}

export type I18nKey = keyof typeof i18nText
export const i18nKey = mapValues(i18nText, (_, key) => key) as Record<
  I18nKey,
  I18nKey
>

export const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  messages: {
    en: i18nText,
    zh: i18nText,
  },
})

export function useI18nText() {
  const { t } = useI18n()
  return t
}
