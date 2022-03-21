import { rest } from 'msw'
import { API } from '../../../config/environment-variables'

export const handler = rest.get(`${API}/users`, (req, res, ctx) => {
  return res(
    ctx.delay(2000),
    ctx.status(200),
    /*ctx.json({ error: 'Something went wrong' }),*/
    ctx.json(users),
  )
})

const users = {
  edges: [
    {
      node: {
        id: 'cl0wg30bs0004h8voxzruqrhu',
        createdAt: '2022-03-18T13:16:17.896Z',
        updatedAt: '2022-03-18T13:16:17.897Z',
        name: 'Moses Monahan',
        email: 'Sean_Quigley99@gmail.com',
        phone: '594.325.7921 x15291',
        password: 'ErvEiVySQZSyPTh',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/756.jpg',
        role: 'DEVELOPER',
      },
      cursor: 'cl0wg30bs0004h8voxzruqrhu',
    },
    {
      node: {
        id: 'cl0wg30ci0011h8vog3qdae9c',
        createdAt: '2022-03-18T13:16:17.922Z',
        updatedAt: '2022-03-18T13:16:17.923Z',
        name: "Lionel O'Reilly",
        email: 'Clay.Ortiz@yahoo.com',
        phone: '544-925-7574 x04453',
        password: 'Pw5UbSSdnritbMV',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/594.jpg',
        role: 'DEVELOPER',
      },
      cursor: 'cl0wg30ci0011h8vog3qdae9c',
    },
    {
      node: {
        id: 'cl0wg30cq0018h8vokd11y28d',
        createdAt: '2022-03-18T13:16:17.930Z',
        updatedAt: '2022-03-18T13:16:17.930Z',
        name: 'Ms. Daisy Sawayn',
        email: 'Tania_Auer27@hotmail.com',
        phone: '501-952-2914 x50800',
        password: 't5bWVJWNxe7hIO4',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/323.jpg',
        role: 'DEVELOPER',
      },
      cursor: 'cl0wg30cq0018h8vokd11y28d',
    },
    {
      node: {
        id: 'cl0wg30cy0025h8voof88kb90',
        createdAt: '2022-03-18T13:16:17.938Z',
        updatedAt: '2022-03-18T13:16:17.939Z',
        name: 'Kristie Schroeder',
        email: 'Lilly.Kovacek@gmail.com',
        phone: '1-594-981-5498',
        password: 'osSsjilrVfE9WHR',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/291.jpg',
        role: 'ADMIN',
      },
      cursor: 'cl0wg30cy0025h8voof88kb90',
    },
    {
      node: {
        id: 'cl0wg30d60032h8vo9xq8lz70',
        createdAt: '2022-03-18T13:16:17.946Z',
        updatedAt: '2022-03-18T13:16:17.947Z',
        name: 'Ms. Gail Tremblay',
        email: 'Lester_Schuster@yahoo.com',
        phone: '608.997.1605 x04287',
        password: '1Om6booNevgLF93',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/856.jpg',
        role: 'ADMIN',
      },
      cursor: 'cl0wg30d60032h8vo9xq8lz70',
    },
    {
      node: {
        id: 'cl0wg30de0039h8voavjdyg35',
        createdAt: '2022-03-18T13:16:17.954Z',
        updatedAt: '2022-03-18T13:16:17.954Z',
        name: 'Valerie Brown III',
        email: 'Alice60@hotmail.com',
        phone: '1-840-670-6875',
        password: 'oHrN0HvUqGfIzef',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/489.jpg',
        role: 'ADMIN',
      },
      cursor: 'cl0wg30de0039h8voavjdyg35',
    },
    {
      node: {
        id: 'cl0wg30dm0046h8vo5wqmuxe4',
        createdAt: '2022-03-18T13:16:17.962Z',
        updatedAt: '2022-03-18T13:16:17.962Z',
        name: 'Kathy Gutkowski',
        email: 'Dorris_Braun@yahoo.com',
        phone: '718.352.4738 x00779',
        password: 'DU7V42jjp_0pJRC',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/745.jpg',
        role: 'ADMIN',
      },
      cursor: 'cl0wg30dm0046h8vo5wqmuxe4',
    },
    {
      node: {
        id: 'cl0wg30dt0053h8voghrxd7bi',
        createdAt: '2022-03-18T13:16:17.969Z',
        updatedAt: '2022-03-18T13:16:17.970Z',
        name: 'Dr. Barry Ledner',
        email: 'Aisha_Moen24@yahoo.com',
        phone: '(209) 972-3438',
        password: 'whVTCKJu1AnOuKK',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/878.jpg',
        role: 'USER',
      },
      cursor: 'cl0wg30dt0053h8voghrxd7bi',
    },
    {
      node: {
        id: 'cl0wg30e10060h8voxa3djlji',
        createdAt: '2022-03-18T13:16:17.977Z',
        updatedAt: '2022-03-18T13:16:17.978Z',
        name: 'Dr. April McCullough',
        email: 'Darion.Powlowski85@yahoo.com',
        phone: '448-530-6014 x21440',
        password: 's9BlYFfPuQpRH90',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/650.jpg',
        role: 'DEVELOPER',
      },
      cursor: 'cl0wg30e10060h8voxa3djlji',
    },
    {
      node: {
        id: 'cl0wg30e90067h8vo36lf30h8',
        createdAt: '2022-03-18T13:16:17.985Z',
        updatedAt: '2022-03-18T13:16:17.986Z',
        name: 'Ian Prosacco',
        email: 'Kavon_Morar41@yahoo.com',
        phone: '747-909-0234 x64879',
        password: 'UiqEPEOmY3EewEc',
        avatar:
          'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/667.jpg',
        role: 'DEVELOPER',
      },
      cursor: 'cl0wg30e90067h8vo36lf30h8',
    },
  ],
  pageInfo: {
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: 'cl0wg30bs0004h8voxzruqrhu',
    endCursor: 'cl0wg30e90067h8vo36lf30h8',
  },
  totalCount: 100,
}
