import { Subject } from 'rxjs'

type DataResolver = (dataSet: { [key: string]: any }[]) => any
interface SharedSubject {
  getSubscriber(key: string): Subject<any>
  removeSubscriber(key: string): void
  createSubscription(key: string): Subject<any>
  setValue(key: string, value: any): void
  setAtomicValue(key: string, dataResolver: DataResolver): void
  getAllKeys(): string[]
  getValue(key: string): any
}

export class SharedSubjectStore implements SharedSubject {
  private subjects: { [key: string]: Subject<any> } = {}
  private store: { [key: string]: any } = {}

  public getSubscriber = (key: string) => this.subjects[key]

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

  public setAtomicValue = (key: string, dataResolver: DataResolver) => {
    const collection = this.store[key]
    this.store[key] = dataResolver(collection)
    this.subjects[key].next(dataResolver(collection))
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
