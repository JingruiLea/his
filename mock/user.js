
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info',
    type: 'get',
    response: req => {
      return JSON.parse(`{"code":200,"data":[{"id":10001,"name":"挂号收费员(测试）","department_name":"心血管内科","title":"专家","shift":"全天","expiry_date":"2019-07-31","scheduling_limit":51,"registration_Level":"普通号"},{"id":10002,"name":"财务管理员(测试","department_name":"心血管内科","title":"专家","shift":"上午","expiry_date":"2019-07-30","scheduling_limit":100,"registration_Level":"急诊号"},{"id":10003,"name":"药房管理员(测试","department_name":"心血管内科","title":"专家","shift":"下午","expiry_date":"2019-06-30","scheduling_limit":20,"registration_Level":"专家号"}]}
len`)
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
