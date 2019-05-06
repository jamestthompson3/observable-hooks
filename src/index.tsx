import * as React from 'react'
import { from, of } from 'rxjs'
import { switchMap, map, startWith, tap, catchError } from 'rxjs/operators'
import { BrowserRouter, withRouter, Route } from 'react-router-dom'
import { get, isEmpty } from 'lodash'

import { SharedSubjectStore } from '../hooks/sharedValue'
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
window.user_store = USER_STORE
// Now, create a component to receive the props from the stream
function IndexPage({ match, history }) {
  const [userList, setUserList] = React.useState([])
  const userSub = USER_STORE.createSubscription('users')
  const [selectedUser, setSelectedUser] = React.useState(null)
  React.useEffect(() => {
    fetchUsers().then(users => {
      console.log('users: ', users)
      userSub.subscribe(users => setUserList(users))
      USER_STORE.setValue('users', users)
    })
  }, [])
  const userParam = get(match, 'params.user')
  if (selectedUser) {
    userParam !== selectedUser.user && history.push(`/${selectedUser.user}`)
  }
  React.useEffect(
    () => {
      if (userList.length > 0) setSelectedUser(userList[0])
    },
    [userList]
  )
  const userSelect = React.useCallback(user => {
    setSelectedUser(userList.find(userInList => userInList.user === user))
  })
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
// Merge all the streams together and map them into the component
// NOTE: they receive props in the order they are passed to the compose function
//const StreamIndex = compose(
//  withState('userList', 'updateUserList', []),
//  withHandlers({
//    setUserList: ({ updateUserList }) => users => updateUserList(state => users),
//    addLike: ({ updateUserList }) => (user, like) => addUserLike(user, like),
//    addDislike: ({ updateUserList }) => (user, dislike) => addUserDislike(user, dislike),
//    deleteLike: ({ updateUserList }) => (user, like) =>
//      deleteUserLike(user, like.id).then(() =>
//        updateUserList(state => [
//          ...state.map(i => {
//            if (i.user === user) {
//              i.likes = i.likes.filter(i => i.id !== like.id)
//            }
//            return i
//          })
//        ])
//      ),
//    deleteDislike: ({ updateUserList }) => (user, dislike) =>
//      deleteUserDislike(user, dislike.id).then(() =>
//        updateUserList(state => [
//          ...state.map(i => {
//            if (i.user === user) {
//              i.dislikes = i.dislikes.filter(i => i.id !== dislike.id)
//            }
//            return i
//          })
//        ])
//      )
//  }),
//  withRouter,
//  load,
//  selectUser,
//  withContext(
//    { updateFunctions: PropTypes.object, user: PropTypes.object },
//    ({ selectedUser, addLike, addDislike, deleteLike, deleteDislike }) => ({
//      user: selectedUser,
//      updateFunctions: { addLike, addDislike, deleteLike, deleteDislike }
//    })
//  )
//)(IndexPage)

export const App = () => (
  <BrowserRouter>
    <div>
      <h2>RXJS recompose Demo</h2>
      <Route path="/:user?" render={props => <IndexPage {...props} />} />
    </div>
  </BrowserRouter>
)
