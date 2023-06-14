import NextAuth from 'next-auth'
import axios from 'axios'
import { getProviders } from "next-auth/react"
import CredentialsProvider from "next-auth/providers/credentials";


const providers = [
    CredentialsProvider({
    name: 'Credentials',
    authorize: async (credentials) => {
        try {
        const user = await axios.post(`localhost:8000/auth/token`,
        {
          user: {
            password: credentials.password,
            email: credentials.email
          }
        },
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json'
          }
        })

          if (user) {
            console.log(user)
          return {status: 'success', data: user.data.user}
        } 
      } catch (e) {
        const errorMessage = e.response.data.message
        // Redirecting to the login page with error messsage in the URL
        throw new Error(errorMessage + '&email=' + credentials.email)
      }

    }
  })
]

const callbacks = {
  async jwt(token, user) {
    if (user) {
      token.accessToken = user.data.token
    }

    return token
  },

  async session(session, token) {
    session.accessToken = token.accessToken
    return session
  }
}

const options = {
  providers,
  callbacks,
  pages: {
    error: '/login' // Changing the error redirect page to our custom login page
  }
}

export default (req, res) => NextAuth(req, res, options)