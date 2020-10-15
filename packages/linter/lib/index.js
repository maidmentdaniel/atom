/* @flow */

import { CompositeDisposable, Disposable } from 'atom'

import Linter from './main'
import type { UI, Linter as LinterProvider } from './types'

// Internal variables
let instance: Linter
let subscriptions: CompositeDisposable

export function activate() {
  subscriptions = new CompositeDisposable()

  instance = new Linter()
  subscriptions.add(instance)

  subscriptions.add(
    atom.packages.onDidActivateInitialPackages(function() {
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter', true)
      }
    }),
  )
}
export function consumeLinter(linter: LinterProvider): Disposable {
  const linters = [].concat(linter)
  for (const entry of linters) {
    instance.addLinter(entry)
  }
  return new Disposable(() => {
    for (const entry of linters) {
      instance.deleteLinter(entry)
    }
  })
}
export function consumeUI(ui: UI): Disposable {
  const uis = [].concat(ui)
  for (const entry of uis) {
    instance.addUI(entry)
  }
  return new Disposable(() => {
    for (const entry of uis) {
      instance.deleteUI(entry)
    }
  })
}
export function provideIndie(): Object {
  return indie => instance.addIndie(indie)
}
export function deactivate() {
  subscriptions.dispose()
}
