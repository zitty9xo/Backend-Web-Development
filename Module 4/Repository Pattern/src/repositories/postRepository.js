let post = [];
let nextId = 1;

function findALl() {
    return [...post];
}

function findById(id) {
    return post.find((p) => p.id === Number(id)) || null;
}

function create(input) {
    const post = { id: nextId++, ...input, createdAt: Date.now() };
    posts.push(post);
    return {...post};

}

function update(id, patch) {
    const index = post.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    post[index] = { ...post[index], ...patch };
    return { ...post[index] };
}

function remove(id) {
    const index = post.findIndex((p) => p.id === Number(id));
    if (index === -1) return false;
    post.splice(index, 1);
    return true;
}
module.exports = { findALl, findById, create, update, remove };