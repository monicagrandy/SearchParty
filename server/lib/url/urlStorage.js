'use strict'

module.exports = {
  localhostUrls: () => {
    return {
      feedback: 'http://localhost:8000/feedback',
      tasks: 'http://localhost:8000/tasks',
      upload: 'http://localhost:8000/upload',
      getPics: 'http://localhost:8000/getPics',
      signup: 'http://localhost:8000/signup',
      signin: 'http://localhost:8000/signin',
      userProfile: 'http://localhost:8000/userProfile',
      addFriend: 'http://localhost:8000/addFriend',
      addFriends: 'http://localhost:8000/addFriends',
      addFriendToHunt: 'http://localhost:8000/addFriendToHunt',
      getFriendHunt: 'http://localhost:8000/getFriendHunt',
      getAddedHunts: 'http://localhost:8000/getAddedHunts',
      addChatMessage: 'http://localhost:8000/addChatMessage',
      getChatMessages: 'http://localhost:8000/getChatMessages',
      singleHunt: 'http://localhost:8000/singleHunt',
      templates: 'http://localhost:8000/templates',
      singleTemplate: 'https://localhost:8000/singleTemplate',
      socket: 'http://localhost:8000'
    }
  }
}