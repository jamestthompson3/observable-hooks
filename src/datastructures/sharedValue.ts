import { Subject } from 'rxjs'

export interface SharedSubject {
  getSubscription(key: string): Subject<any>
  removeSubscription(key: string): void
  createSubscription(key: string): Subject<any>
  setValue(key: string, value: any): void
  getAllKeys(): string[]
  getSnapshot(): { [key: string]: any }
  getValue(key: string): any
}

export class SharedSubjectStore implements SharedSubject {
  private subjects: { [key: string]: Subject<any> } = {}
  private store: { [key: string]: any } = {}

  public getSubscription = (key: string) => this.subjects[key]

  public createSubscription = (key: string) => {
    const subject = this.subjects[key]
    const storevalue = this.store[key]
    if (subject && storevalue) return subject
    this.subjects[key] = new Subject()
    this.store[key] = undefined
    return this.subjects[key]
  }

  public setValue = (key: string, value: any) => {
    this.store[key] = value
    this.subjects[key].next(value)
  }

  public getSnapshot = () => this.store
  public getAllKeys = () => Object.keys(this.subjects)
  public getValue = (key: string) => {
    return this.store[key]
  }

  public removeSubscription = (key: string) => {
    const selectedSub = this.subjects[key]
    if (!selectedSub) return
    selectedSub.complete()
    delete this.subjects[key]
  }
}
