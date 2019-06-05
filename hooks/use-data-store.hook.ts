import { useEffect } from 'react'
import { SharedSubject } from '../src/datastructures/sharedValue'

type SubscriptionCallback = (value: any) => any | void

export function useSubscription(
  store: SharedSubject,
  subscriptionKey: string,
  cb: SubscriptionCallback
) {
  useEffect(() => {
    store.createSubscription(subscriptionKey).subscribe(cb)
  }, [])
}

type SubscriptionSelector = (value: any) => any

export function useSelector(
  store: SharedSubject,
  subscriptionKey: string,
  selector: SubscriptionSelector
) {
  store.getSubscription(subscriptionKey).subscribe(selector)
}
