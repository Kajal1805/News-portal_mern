import React, { useEffect, useState } from 'react'

const Comment = ({comment}) => {

    const [user, setUser] = useState({})
    console.log(user)
    useEffect(() => {
    const getUser = async () => {
        try {
            const res = await fetch(`/api/user/${comment.userId}`)

            const data = await res.json()

            if (res.ok) {
                setUser(data)
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    }, [comment])
  return (
    <div>Comment</div>
  )
}

export default Comment