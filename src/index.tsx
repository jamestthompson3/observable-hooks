import * as React from 'react'
import { BrowserRouter, withRouter, Route } from 'react-router-dom'
import { get } from 'lodash'

import { SharedSubjectStore } from './datastructures/sharedValue'
import { useSubscription } from '../hooks/use-data-store.hook'
import { PageWrapper, ListContainer, ListItem, Loader, UserContainer } from './styledComponents'
import { InfoTables } from './InfoTables'
import {
  fetchUsers,
  addUserLike,
  addUserDislike,
  deleteUserDislike,
  deleteUserLike
} from './asyncData'

export const USER_STORE = new SharedSubjectStore()
// for debugging
window.user_store = USER_STORE

function IndexPage({ match, history }) {
  // useState is necessary with these subscriptions to force top level re-renders
  const [userList, setUserList] = React.useState([])
  const [selectedUser, setSelectedUser] = React.useState(null)
  const userSub = useSubscription(USER_STORE, 'users', users => setUserList(users))
  const selectedUserSub = useSubscription(USER_STORE, 'selectedUser', selected =>
    setSelectedUser(selected)
  )
  React.useEffect(() => {
    fetchUsers().then(users => {
      USER_STORE.setValue('users', users)
    })
  }, [])
  const userParam = get(match, 'params.user')
  React.useEffect(() => {
    USER_STORE.setValue('selectedUser', userList.find(user => user.user === userParam))
  }, [userList])

  if (selectedUser) {
    userParam !== selectedUser.user && history.push(`/${selectedUser.user}`)
  }
  const userSelect = user => {
    const foundUser = userList.find(userInList => userInList.user === user.user)
    USER_STORE.setValue('selectedUser', foundUser)
  }
  // Remove
  const message = 'test'
  status = 'SUCCESS'
  return (
    <PageWrapper>
      <UserContainer>
        {status === 'SUCCESS' ? (
          <>
            <h3>Users</h3>
            <ListContainer style={{ height: '500px' }}>
              {userList.map((user, i) => (
                <ListItem key={i} onClick={() => userSelect(user)} selected={user === selectedUser}>
                  <p>{user.user}</p>
                </ListItem>
              ))}
            </ListContainer>
          </>
        ) : (
          <Loader status={status} message={message} />
        )}
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
