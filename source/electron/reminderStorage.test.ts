
import { ReminderStorage } from './reminderStorage.cjs';
import Store = require('electron-store');

jest.mock('electron-store');
let store = jest.mocked(new Store());
store.get.mockReturnValue([{
	name: 'r',
	dates: [23]
}]);
store.set.mockReturnValue(undefined);

test('test', () => {
	//throw store.get['mock'];
	const x = new ReminderStorage(store);
	expect(store.get).toBeCalledWith('reminders');
});