import JoplinSettings, { ChangeHandler } from "api/JoplinSettings"
import { SettingItem, SettingSection } from "api/types"

export interface FakeJoplinSettingsProps {
  /**
   * The pre-defined settings retrievable with {@link JoplinSettings#value} (defaults to none).
   */
  values?: Record<string, unknown>
}

export type FakeJoplinSettings = JoplinSettings & Extensions
export namespace FakeJoplinSettings {
  export function create(props?: FakeJoplinSettingsProps): FakeJoplinSettings {
    return new ExtendedJoplinSettings(props) as unknown as FakeJoplinSettings
  }
}

type PartialJoplinSettings = Pick<
  JoplinSettings,
  "onChange" | "registerSection" | "registerSettings" | "value"
>

export interface Extensions {
  readonly ext: {
    /**
     * Represents the {@link ChangeHandler} registered with {@link JoplinSettings#onChange} (if called).
     */
    readonly changeHandler: ChangeHandler | undefined

    /**
     * Represents the sections registered with {@link JoplinSettings#registerSection}.
     */
    readonly settingSections: ReadonlyMap<string, SettingSection>

    /**
     * Represents the settings registered with {@link JoplinSettings#registerSettings}.
     */
    readonly settingItems: ReadonlyMap<string, SettingItem>
  }
}

// noinspection JSUnusedGlobalSymbols
class ExtendedJoplinSettings implements PartialJoplinSettings, Extensions {
  private readonly values: Record<string, unknown>

  // noinspection JSUnusedGlobalSymbols
  readonly ext = new (class {
    changeHandler: ChangeHandler | undefined
    readonly settingSections = new Map<string, SettingSection>()
    readonly settingItems = new Map<string, SettingItem>()
  })()

  constructor(props?: FakeJoplinSettingsProps) {
    this.values = props?.values ?? {}
  }

  onChange(changeHandler: ChangeHandler): Promise<void> {
    this.ext.changeHandler = changeHandler
    return Promise.resolve()
  }

  value(key: string): Promise<unknown> {
    return Promise.resolve(new Map(Object.entries(this.values)).get(key))
  }

  registerSection(name: string, section: SettingSection): Promise<void> {
    this.ext.settingSections.set(name, section)
    return Promise.resolve()
  }

  registerSettings(settings: Record<string, SettingItem>): Promise<void> {
    Object.entries(settings).forEach(([name, item]) => {
      this.ext.settingItems.set(name, item)
    })

    return Promise.resolve()
  }
}
