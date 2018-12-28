const expect = require('expect');

const { Users } = require('../users');

describe('Users', () => {
  let testUsers;

  beforeEach(() => {
    testUsers = new Users();
    testUsers.users = [
      { id: '1', name: 'Mike', room: 'Pokemon' },
      { id: '2', name: 'Joe', room: 'Pokemon' },
      { id: '3', name: 'Julie', room: 'Starwars' }
    ];
  });

  it('should add new user', () => {
    const testUsers = new Users();
    const user = {
      id: '123',
      name: 'Joe',
      room: 'Pokemon'
    };
    testUsers.addUser(user.id, user.name, user.room);

    expect(testUsers.users).toEqual([user]);
  });

  it('should return names for room Pokemon', () => {
    const userList = testUsers.getUserList('Pokemon');

    expect(userList).toEqual(['Mike', 'Joe']);
  });

  it('should return names for room Starwars', () => {
    const userList = testUsers.getUserList('Starwars');

    expect(userList).toEqual(['Julie']);
  });

  it('should remove an existing user', () => {
    const userId = '1';
    const user = testUsers.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(testUsers.users.length).toBe(2);
    expect(testUsers.users).toEqual([
      { id: '2', name: 'Joe', room: 'Pokemon' },
      { id: '3', name: 'Julie', room: 'Starwars' }
    ]);
  });

  it('should not remove an unexisting user', () => {
    const userId = '10';
    const user = testUsers.removeUser(userId);

    expect(user).toBeUndefined;
    expect(testUsers.users.length).toBe(3);
    expect(testUsers.users).toEqual([
      { id: '1', name: 'Mike', room: 'Pokemon' },
      { id: '2', name: 'Joe', room: 'Pokemon' },
      { id: '3', name: 'Julie', room: 'Starwars' }
    ]);
  });

  it('should find an existing user', () => {
    const userId = '2';
    const user = testUsers.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find an unexisting user', () => {
    const userId = '10';
    const user = testUsers.getUser(userId);

    expect(user).toBeUndefined();
  });
});
