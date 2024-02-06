import {compare, hash} from "bcrypt";
const PasswordUtils = {
	hash(password) {
		const saltRounds = 10;
		return hash(password, saltRounds);
	},
	compare(password, hash) {
		return compare(password, hash);
	},
};

export default PasswordUtils;