import * as React from 'react'
import { BrowserRouter, withRouter, Route } from 'react-router-dom'
import { get } from 'lodash'

import { SharedSubjectStore } from './datastructures/sharedValue'
import { useSubscription, useSelector } from '../hooks/use-data-store.hook'
import { PageWrapper, ListContainer, ListItem, Loader, UserContainer } from './styledComponents'
import { InfoTables } from './InfoTables'
import { fetchUsers, User } from './asyncData'

function memoUsers(updateUser) {
  const cache = {}
  return function(userList) {
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

function IndexPage({ match, history }) {
  console.log('indexpage rendered') // we should expect this to only happen twice
  // useState is necessary with these subscriptions to force top level re-renders
  const [userList, setUserList] = React.useState([])
  const [selectedUser, setSelectedUser] = React.useState(null)
  const userSub = useSelector(USER_STORE, 'users', memoUsers(setUserList))
  const selectedUserSub = useSelector(USER_STORE, 'selectedUser', setSelectedUser)
  React.useEffect(() => {
    fetchUsers().then(users => {
      USER_STORE.setValue('users', users)
    })
  }, [])
  const userParam = get(match, 'params.user')
  React.useEffect(() => {
    USER_STORE.setValue('selectedUser', userList.find(user => user.user === userParam))
  }, [userList])

  React.useEffect(() => {
    if (selectedUser) {
      userParam !== selectedUser.user && history.push(`/${selectedUser.user}`)
    }
  }, [selectedUser])
  const userSelect = user => {
    const foundUser = userList.find(userInList => userInList.user === user.user)
    USER_STORE.setValue('selectedUser', foundUser)
  }

  return (
    <PageWrapper>
      <UserContainer>
        <h3>Users</h3>
        <ListContainer style={{ height: '500px' }}>
          {userList.map((user, i) => (
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
  <BrowserRouter>
    <div>
      <h2>RXJS DataStores Demo</h2>
      <Route path="/:user?" render={props => <IndexPage {...props} />} />
    </div>
  </BrowserRouter>
)
