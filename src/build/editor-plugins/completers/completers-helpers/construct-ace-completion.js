export default function (meta, keyword) {
    if(keyword.slice(0, 2) === "__") {
        return {}
    }

    return {
        name: keyword,
        value: keyword,
        score: 300,
        meta: meta || "keyword"
    }
}