(async () => {
    const url = 'https://firestore.googleapis.com/v1/projects/my-personal-web-bc6c9/databases/(default)/documents/comments';

    const payload = {
        fields: {
            postId: { stringValue: 'test' },
            authorName: { stringValue: 'test' },
            text: { stringValue: 'test' },
            createdAt: { integerValue: 123 }
        }
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch error:", err);
    }
})();
