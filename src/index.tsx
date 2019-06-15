import * as React from 'react'

import { SharedSubjectStore } from './datastructures/sharedValue'
import { useSelector } from '../hooks/use-data-store.hook'
import { PageWrapper, ListContainer, ListItem, UserContainer } from './styledComponents'
import { InfoTables } from './InfoTables'
import { fetchUsers, User } from './asyncData'

function memoUsers(updateUser) {
  const cache = {}
  return function(userList: User[]) {
    const key = JSON.stringify(userList.map(user => user.user))
    if (cache[key]) {
      // don't call to re-render
    } else {
      cache[key] = key
      updateUser.apply(null, arguments)
    }
  }
}

export const USER_STORE = new SharedSubjectStore()
USER_STORE.createSubscription('users')
USER_STORE.createSubscription('selectedUser')

function IndexPage() {
  console.log('indexpage rendered') // we should expect this to only happen twice
  // useState is necessary with these subscriptions to force top level re-renders
  const [userList, setUserList] = React.useState([])
  const [selectedUser, setSelectedUser] = React.useState(null)
  const userSub = useSelector(USER_STORE, 'users', memoUsers(setUserList))
  const selectedUserSub = useSelector(USER_STORE, 'selectedUser', setSelectedUser)
  React.useEffect(() => {
    fetchUsers().then((users: User[]) => {
      USER_STORE.setValue('users', users)
    })
  }, [])

  const userSelect = (user: User) => {
    const foundUser = userList.find(userInList => userInList.user === user.user)
    USER_STORE.setValue('selectedUser', foundUser)
  }

  return (
    <PageWrapper>
      <UserContainer>
        <h3>Users</h3>
        <ListContainer style={{ height: '500px' }}>
          {userList.map((user: User, i: number) => (
            <ListItem key={i} onClick={() => userSelect(user)} selected={user === selectedUser}>
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
