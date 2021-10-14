import { ajax } from 'rxjs/ajax';
import { reviver, replacer } from "./utils";


export const UniversityApi = {
  search(options) {
    const paramTuples = [
      ['name', options.uniName],
      ['country', options.country],
      ['offset', options.offset],
      ['limit', options.limit],
    ];
    const queryString = paramTuples
      .filter(([_, fieldVal]) => fieldVal !== undefined)
      .map(([fieldName, fieldVal]) => `${fieldName}=${fieldVal}`)
      .join('&');

    return ajax.getJSON(`/search?${queryString}`);
  },
  async loadLikedUnivesitiesByUser(userPayload) {
    const { mail } = userPayload;
    try {
      let response = await new Promise((resolve) => {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]", reviver);
        const [user] = registeredUsers.filter(n => n.mail === mail);
        if (!user) {
          resolve({ likedUniversities: null, errors: ['can not load liked universities because user is not exist'] });
        } else {
          resolve({ likedUniversities: user.likedUniversities, errors: [] });
        }
      });
      let data = response;
      if (!data.errors.length) {
        return data;
      }
    } catch (error) {
    }
  },
  async updateLikedUniversitiesByUser(userPayload) {
    const { mail, likedUniversities } = userPayload;
    try {
      let response = await new Promise((resolve) => {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]", reviver);
        const [user] = registeredUsers.filter(n => n.mail === mail);
        if (!user) {
          resolve({ likedUniversities: null, errors: ['can not update liked universities because user is not exist'] });
        } else {
          user.likedUniversities = likedUniversities;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers, replacer));
          resolve({ likedUniversities, errors: [] });
        }
      });
      let data = response;
      if (!data.errors.length) {
        return data;
      }
    } catch (err) {
    }
  }
};
