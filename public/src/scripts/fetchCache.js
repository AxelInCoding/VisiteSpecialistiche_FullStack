export function generateFetchComponent() {
    return {
        addBook: async (data) => {
            const res = await fetch ("/insert",{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data) 
            }).catch(console.error);
            return res.json();
        },

        getAllBooks: async () => {
            const res = await fetch("/select").catch(console.error);
            const allBooks = await res.json();
            return allBooks.visits;
        },

        getAllTypes: async () => {
            const res = await fetch("/types").catch(console.error);
            const allTypes = await res.json();
            return allTypes.types;
        }
    };
}