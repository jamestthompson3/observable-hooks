import * as React from 'react'

import { TableContainer, LikesContainer, ListItem, ListHeader, AddPopup } from './styledComponents'
import { USER_STORE } from './index'
import { addUserLike, addUserDislike, deleteUserLike, deleteUserDislike } from './asyncData'

const addLike = (user, text) => {
  addUserLike(user, text).then(updatedUser =>
    USER_STORE.setWithResolver('users', users => {
      const targetUser = users.find(listUser => listUser.user === user)
      return users.map(listUser => (listUser.user === targetUser.user ? updatedUser : listUser))
    })
  )
}

const deleteLike = (user, text) => {
  deleteUserLike(user, text).then(({ status }) =>
    USER_STORE.setWithResolver('users', users => {
      const targetUser = users.find(listUser => listUser.user === user)
      console.log(targetUser.likes.filter(like => like.id !== text.id))
      return users.map(listUser =>
        listUser.user === targetUser.user && status === 200
          ? { ...listUser, likes: listUser.likes.filter(like => like.id !== text.id) }
          : listUser
      )
    })
  )
}

const addDislike = (user, text) => {
  addUserDislike(user, text).then(updatedUser =>
    USER_STORE.setWithResolver('users', users => {
      const targetUser = users.find(listUser => listUser.user === user)
      return users.map(listUser => (listUser.user === targetUser.user ? updatedUser : listUser))
    })
  )
}

const deleteDislike = (user, text) => {
  deleteUserDislike(user, text).then(({ status }) =>
    USER_STORE.setWithResolver('users', users => {
      const targetUser = users.find(listUser => listUser.user === user)
      return users.map(listUser =>
        listUser.user === targetUser.user && status === 200
          ? { ...listUser, dislikes: listUser.dislikes.filter(dislike => dislike.id !== text.id) }
          : listUser
      )
    })
  )
}

const LikesList = () => {
  const user = USER_STORE.getValue('selectedUser')
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
          handleSubmit={() => addLike(user.user, text)}
          closeModal={toggleModal}
          text={text}
        />
        {user.likes.map(like => (
          <ListItem open={isOpen} key={like.item + like.id}>
            {like.item}
            <i className="material-icons" onClick={() => deleteLike(user.user, like)}>
              delete
            </i>
          </ListItem>
        ))}
      </LikesContainer>
    </>
  )
}

const DislikesList = () => {
  const user = USER_STORE.getValue('selectedUser')
  const [isOpen, setIsOpen] = React.useState(false)
  const [text, setText] = React.useState('')
  const toggleModal = () => setIsOpen(!isOpen)
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
          handleSubmit={() => addDislike(user.user, text)}
          closeModal={toggleModal}
          text={text}
        />
        {user.dislikes.map(dislike => (
          <ListItem open={isOpen} key={dislike.item + dislike.id}>
            {dislike.item}
            <i className="material-icons" onClick={() => deleteDislike(user.user, dislike)}>
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
