import * as React from 'react'

import { TableContainer, LikesContainer, ListItem, ListHeader, AddPopup } from './styledComponents'
import { useSelector } from '../hooks/use-data-store.hook'
import { USER_STORE } from './index'
import { addUserLike, User, addUserDislike, deleteUserLike, deleteUserDislike } from './asyncData'

const addLike = text => {
  const selectedUser = USER_STORE.getValue('selectedUser')
  const users = USER_STORE.getValue('users')
  addUserLike(selectedUser.user, text).then(updatedUser => {
    const targetUser = users.find(listUser => listUser.user === selectedUser.user)
    const newUsers = users.map(listUser =>
      listUser.user === targetUser.user ? updatedUser : listUser
    )
    USER_STORE.setValue('users', newUsers)
  })
}

const deleteLike = like => {
  const selectedUser = USER_STORE.getValue('selectedUser')
  const users = USER_STORE.getValue('users')
  deleteUserLike(selectedUser.user, like).then(({ status }) => {
    const targetUser = users.find(listUser => listUser.user === selectedUser.user)
    const newUsers = users.map(listUser =>
      listUser.user === targetUser.user && status === 200
        ? { ...listUser, likes: listUser.likes.filter(like => like.id !== like.id) }
        : listUser
    )

    USER_STORE.setValue('users', newUsers)
  })
}

const addDislike = text => {
  const selectedUser = USER_STORE.getValue('selectedUser')
  const users = USER_STORE.getValue('users')
  addUserDislike(selectedUser.user, text).then(updatedUser => {
    const targetUser = users.find(listUser => listUser.user === selectedUser.user)
    const newUsers = users.map(listUser =>
      listUser.user === targetUser.user
        ? {
            ...listUser,
            dislikes: [...listUser.dislikes, { id: listUser.dislikes.length + 1, item: text }]
          }
        : listUser
    )
    USER_STORE.setValue('users', newUsers)
  })
}

const deleteDislike = dislike => {
  const selectedUser = USER_STORE.getValue('selectedUser')
  const users = USER_STORE.getValue('users')
  deleteUserDislike(selectedUser.user, dislike).then(({ status }) => {
    const targetUser = users.find(listUser => listUser.user === selectedUser.user)
    const newUsers = users.map(listUser =>
      listUser.user === targetUser.user && status === 200
        ? { ...listUser, dislikes: listUser.dislikes.filter(dislike => dislike.id !== dislike.id) }
        : listUser
    )

    USER_STORE.setValue('users', newUsers)
  })
}

const LikesList = () => {
  const selectedUser = USER_STORE.getValue('selectedUser')
  const [userLikes, setUserLikes] = React.useState(selectedUser.likes)
  React.useEffect(
    () => {
      console.log(selectedUser)
      setUserLikes(selectedUser.likes)
    },
    [selectedUser]
  )
  USER_STORE.getSubscription('users').subscribe(users => {
    const user = users.find(user => user.user === selectedUser.user)
    setUserLikes(user.likes)
  })
  const [isOpen, setIsOpen] = React.useState(false)
  const [text, setText] = React.useState('')
  const toggleModal = () => setIsOpen(!isOpen)

  return (
    <>
      <ListHeader>
        <h3 style={{ margin: 0 }}>Likes</h3>
        <i className="material-icons" style={{ cursor: 'pointer' }} onClick={toggleModal}>
          add
        </i>
      </ListHeader>
      <LikesContainer style={{ marginBottom: 20 }}>
        <AddPopup
          open={isOpen}
          onChange={setText}
          handleSubmit={() => addLike(text)}
          closeModal={toggleModal}
          text={text}
        />
        {userLikes.map(like => (
          <ListItem open={isOpen} key={like.item + like.id}>
            {like.item}
            <i className="material-icons" onClick={() => deleteLike(like)}>
              delete
            </i>
          </ListItem>
        ))}
      </LikesContainer>
    </>
  )
}

const DislikesList = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [text, setText] = React.useState('')
  const toggleModal = () => setIsOpen(!isOpen)
  const selectedUser = USER_STORE.getValue('selectedUser')
  const [userDislikes, setUserLikes] = React.useState(selectedUser.likes)
  USER_STORE.getSubscription('users').subscribe(users => {
    const user = users.find(user => user.user === selectedUser.user)
    setUserLikes(user.dislikes)
  })
  return (
    <>
      <ListHeader>
        <h3 style={{ margin: 0 }}>Dislikes</h3>
        <i className="material-icons" style={{ cursor: 'pointer' }} onClick={toggleModal}>
          add
        </i>
      </ListHeader>
      <LikesContainer>
        <AddPopup
          open={isOpen}
          onChange={setText}
          handleSubmit={() => addDislike(text)}
          closeModal={toggleModal}
          text={text}
        />
        {userDislikes.map(dislike => (
          <ListItem open={isOpen} key={dislike.item + dislike.id}>
            {dislike.item}
            <i className="material-icons" onClick={() => deleteDislike(dislike)}>
              delete
            </i>
          </ListItem>
        ))}
      </LikesContainer>
    </>
  )
}

export const InfoTables = () => {
  return (
    <TableContainer>
      <LikesList />
      <DislikesList />
    </TableContainer>
  )
}
