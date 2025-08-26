import { debugUtils } from "./debug"

class KeyEventManager {
	listeners: Map<string, {
    context: string | null,
    fireOnRepeat: boolean,
    preventDefault: boolean,
    keyDownCallback: (() => void),
    keyUpCallback: (() => void) | null
  }[]>
  activeKeys: Set<string>
	private activeContext: string|null

  constructor() {
    this.listeners = new Map()
    this.activeKeys = new Set()
    this.activeContext = null

    window.addEventListener('keydown', this.handleKeyDown.bind(this), true)
    window.addEventListener('keyup', this.handleKeyUp.bind(this), true)

    addEventListener("beforeunload", (event) => event.preventDefault());
  }

  /**
   * Subscribe to a key event.
   * @param keyCombos - An array of key combinations, e.g. "Ctrl+Shift+S".
   * @param keyDownCallback - The function to call when the keydown event occurs.
   * @param keyUpCallback - The optional function to call when the keyup event occurs.
   * @param context - Optional context to group subscriptions. Default 'gameplay'.
   * @param fireOnRepeat - Whether to fire the keydown event on repeat. Default false.
   * @param preventDefault - Whether to prevent the default browser action. Default true.
   */
  subscribe(keyCombos: string[],
    keyDownCallback: () => void,
    keyUpCallback: (() => void) | null = null,
    context: string|null = "gameplay",
    fireOnRepeat: boolean = false,
    preventDefault: boolean = true)
  {
    for (let keyCombo of keyCombos) {
      keyCombo = this.normalizeKeyCombo(keyCombo);
      if (!this.listeners.has(keyCombo)) {
        this.listeners.set(keyCombo, [{context, fireOnRepeat, preventDefault, keyDownCallback, keyUpCallback}])
      } else {
        this.listeners.get(keyCombo)!.push({context, fireOnRepeat, preventDefault, keyDownCallback, keyUpCallback})
      }
    }
  }

  /**
   * Unsubscribe from a specific key event.
   * @param keyCombos - An array of key combinations to unsubscribe from.
   */
  unsubscribe(keyCombos: string[]) {
    for (let keyCombo of keyCombos) {
      keyCombo = this.normalizeKeyCombo(keyCombo)
      this.listeners.delete(keyCombo)
    }
  }

  /**
   * Set the active context for the key manager.
   * @param context - The active context, or null for global.
   */
  setContext(context: string|null) {
    this.activeContext = context
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.defaultPrevented) {
      return // Do nothing if event already handled
    }
    
    const combo = this.buildCombo(event)
    // Prevent repeat keydown events. Unfortunately we can't trust the browser to do this for us consistently across platforms, so we have to handle it all ourselves.
    if (this.activeKeys.has(combo)) return
    this.activeKeys.add(combo)

    //Fire once always. If it's a repeat, it will be fired again in update()
    if (this.listeners.has(combo)) {
      for (const listener of this.listeners.get(combo)!) {
        if (listener.context === this.activeContext || !listener.context) {
          if (listener.preventDefault) {
            event.preventDefault()
          }
          listener.keyDownCallback()
        }
      }
    }
  }

  update() {
    for (const combo of this.activeKeys) {
      if (this.listeners.has(combo)) {
        for (const listener of this.listeners.get(combo)!) {
          if (listener.fireOnRepeat && (listener.context === this.activeContext || !listener.context)) {
            listener.keyDownCallback()
          }
        }
      }
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.defaultPrevented) {
      return; // Do nothing if event already handled
    }
    event.preventDefault()
    const combo = this.buildCombo(event)
    this.activeKeys.delete(combo)

    if (this.listeners.has(combo)) {
      for (const listener of this.listeners.get(combo)!) {
        if (listener.keyUpCallback && (listener.context === this.activeContext || !listener.context)) {
          listener.keyUpCallback()
        }
      }
    }
  }

  normalizeKeyCombo(combo: string) {
    return combo
      //.toLowerCase()
      .split('+')
      .sort()
      .join('+')
  }

  buildCombo(event: KeyboardEvent) {
    console.log(`Raw event key:'${event.key}' code:'${event.code}'`)
    const keys: string[] = [];
    // if (event.ctrlKey) keys.push('Control')
    // if (event.shiftKey) keys.push('Shift')
    // if (event.altKey) keys.push('Alt')
    // if (event.metaKey) keys.push('Meta')
      //event.getModifierState
    keys.push(event.code)
    return keys.sort().join('+')
  }

  getKeyCombosForSimpleCommonActions(action: string): string[] {
    switch (action) {
      case "up":
        return ["ArrowUp", "KeyW"]
      case "down":
        return ["ArrowDown", "KeyS"]
      case "left":
        return ["ArrowLeft", "KeyA"]
      case "right":
        return ["ArrowRight", "KeyD"]
      case "debug":
        return ["F1"]
      case "speedUp":
        return ["F2"]
      case "speedDown":
        return ["F3"]
      default:
        throw new Error(`Unknown action '${action}'`)
    }
  }
}
let keyEventManager = new KeyEventManager
export { keyEventManager }