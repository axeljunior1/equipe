export const updateObject = (A, B) => {
    Object.keys(A).forEach(key => {
        if (B.hasOwnProperty(key)) {
            A[key] = B[key];
        }
    });
}