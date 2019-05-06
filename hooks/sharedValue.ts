import { Subject } from 'rxjs'

interface SharedSubject {
  getSubscriber(key: string): Subject<any>
  removeSubscriber(key: string): void
  createSubscription(key: string): Subject<any>
  setValue(key: string, value: any): void
  getAllKeys(): string[]
  getValue(key: string): any
}

export class SharedSubjectStore implements SharedSubject {
  private subjects: { [key: string]: Subject<any> } = {}
  private store: { [key: string]: any } = {}

  public getSubscriber = (key: string) => this.subjects[key]

  public createSubscription = (key: string) => {
    this.subjects[key] = new Subject()
    this.store[key] = undefined
    return this.subjects[key]
  }

  public setValue = (key: string, value: any) => {
    this.store[key] = value
    this.subjects[key].next(value)
  }

  public getAllKeys = () => Object.keys(this.subjects)
  public getValue = (key: string) => {
    return this.store[key]
  }

  public removeSubscriber = (key: string) => {
    const selectedSub = this.subjects[key]
    if (!selectedSub) return
    // broadcast to others that we're done here
    selectedSub.next(undefined)
    selectedSub.complete()
    delete this.subjects[key]
  }
}
