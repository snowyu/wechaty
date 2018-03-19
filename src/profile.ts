/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import * as fs    from 'fs'
import * as path  from 'path'

import {
  config,
  log,
}           from './config'

export type ProfileSection = 'cookies'

export interface ProfileSchema {
  cookies?:   any[]
}

export class Profile {
  private obj  : ProfileSchema
  private file : string | null

  constructor(
    public name = config.profile,
  ) {
    log.verbose('Profile', 'constructor(%s)', name)

    if (!name) {
      this.file = null
    } else {
      this.file = path.isAbsolute(name)
        ? name
        : path.join(
            process.cwd(),
            name,
          )
      if (!/\.wechaty\.json$/.test(this.file)) {
        this.file +=  '.wechaty.json'
      }
    }
  }

  public toString() {
    return `Profile<${this.name}>`
  }

  public load(): void {
    log.verbose('Profile', 'load() file: %s', this.file)
    this.obj = {}

    if (!this.file) {
      log.verbose('Profile', 'load() no file, NOOP')
      return
    }

    if (!fs.existsSync(this.file)) {
      log.verbose('Profile', 'load() file not exist, NOOP')
      return
    }

    const text = fs.readFileSync(this.file).toString()
    try {
      this.obj = JSON.parse(text)
    } catch (e) {
      log.error('Profile', 'load() exception: %s', e)
    }
  }

  public save(): void {
    log.verbose('Profile', 'save() file: %s', this.file)
    if (!this.file) {
      log.verbose('Profile', 'save() no file, NOOP')
      return
    }
    if (!this.obj) {
      log.verbose('Profile', 'save() no obj, NOOP')
      return
    }

    try {
      const text = JSON.stringify(this.obj)
      fs.writeFileSync(this.file, text)
    } catch (e) {
      log.error('Profile', 'save() exception: %s', e)
      throw e
    }
  }

  public get(section: ProfileSection): null | any {
    log.verbose('Profile', 'get(%s)', section)
    if (!this.obj) {
      return null
    }
    return this.obj[section]
  }

  public set(section: ProfileSection, data: any): void {
    log.verbose('Profile', 'set(%s, %s)', section, data)
    if (!this.obj) {
      this.obj = {}
    }
    this.obj[section] = data
  }

  public destroy(): void {
    log.verbose('Profile', 'destroy() file: %s', this.file)
    this.obj = {}
    if (this.file && fs.existsSync(this.file)) {
      fs.unlinkSync(this.file)
      this.file = null
    }
  }
}

export default Profile
