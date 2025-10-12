export const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export const formatDatePeriod = (startDateString, endDateString) => {
    const start = new Date(startDateString).getFullYear();
    if (!endDateString) {
        return `${start} - Present`;
    }
    const end = new Date(endDateString).getFullYear();
    return `${start} - ${end}`;
};

export const getImageUrl = (fileName, dir) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${dir}/${fileName}`;
}