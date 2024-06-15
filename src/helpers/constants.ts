export const userSelectOptions = {
  id: true,
  createdAt: true,
  updatedAt: true,
  username: true,
  about: true,
  avatar: true,
};

export const wishSelectOptions = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  link: true,
  image: true,
  price: true,
  raised: true,
  copied: true,
  description: true,
  owner: true,
  offers: true,
};

export const offerSelectOptions = {
  id: true,
  createdAt: true,
  updatedAt: true,
  user: true,
  amount: true,
  hidden: true,
};

export const wishlistlistSelectOptions = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  image: true,
  owner: true,
};

export const relations = {
  user: {
    wishes: true,
    offers: true,
    wishlists: {
      owner: true,
      items: true,
    },
  },
};
