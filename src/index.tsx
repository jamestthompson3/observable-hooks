import * as React from 'react'

import { SharedSubjectStore } from './datastructures/sharedValue'
import { useSelector } from '../hooks/use-data-store.hook'
import { PageWrapper, ListContainer, ListItem, UserContainer } from './styledComponents'
import { InfoTables } from './InfoTables'
import { fetchUsers, User } from './asyncData'

function memoUsers() {
  const cache = {}
  return function(updateUser) {
    return function(userList: User[]) {
      const key = JSON.stringify(userList.map(user => user.user))
      if (cache[key]) {
        // don't call to re-render
      } else {
        cache[key] = key
        updateUser(userList)
      }
    }
  }
}

export const USER_STORE = new SharedSubjectStore()
USER_STORE.createSubscription('users')
USER_STORE.createSubscription('selectedUser')
const cache = memoUsers()

function IndexPage() {
  console.log('indexpage rendered')
  // useState is necessary with these subscriptions to force top level re-renders
  const [userList, setUserList] = React.useState([])
  const [selectedUser, setSelectedUser] = React.useState(null)
  const setCachedUserList = cache(setUserList)
  useSelector(USER_STORE, 'users', setCachedUserList)
  useSelector(USER_STORE, 'selectedUser', setSelectedUser)

  React.useEffect(() => {
    fetchUsers().then((users: User[]) => {
      USER_STORE.setValue('users', users)
    })
  }, [])

  const userSelect = (user: User) => {
    const foundUser = userList.find(userInList => userInList.user === user.user)
    USER_STORE.setValue('selectedUser', foundUser)
  }
  console.log('IN INDEX: ', selectedUser)

  return (
    <PageWrapper>
      <UserContainer>
        <h3>Users</h3>
        <ListContainer style={{ height: '500px' }}>
          {userList.map((user: User, i: number) => (
            <ListItem
              key={i}
              onClick={() => userSelect(user)}
              selected={selectedUser && user.user === selectedUser.user}
            >
              <p>{user.user}</p>
            </ListItem>
          ))}
        </ListContainer>
      </UserContainer>
      {selectedUser && <InfoTables />}
    </PageWrapper>
  )
}

export const App = () => (
  <div>
    <h2>RXJS DataStores Demo</h2>
    <IndexPage />
  </div>
)
