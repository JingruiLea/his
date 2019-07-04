export default[
  {
    url: 'settlementCategoryManagement/all',
    type: 'post',
    response: req => {
      return JSON.parse(`{"code":200,"data":[{"id":4,"name":"交通银行"},{"id":2,"name":"农业银行"},{"id":3,"name":"建设银行"},{"id":6,"name":"微信"},{"id":5,"name":"支付宝"},{"id":1,"name":"现金"}]}`)
    }
  },
  {
    url: '/settlementCategoryManagement/add',
    type: 'post',
    response: req => {
      return {
        code: 200,
        data: []
      }
    }
  },
  {
    url: '/settlementCategoryManagement/delete',
    type: 'post',
    response: req => {
      return {
        code: 200,
        data: []
      }
    }
  },
  {
    url: '/settlementCategoryManagement/update',
    type: 'post',
    response: req => {
      return {
        code: 200,
        data: []
      }
    }
  }
]