export default function PaginationControl({
    setCurrentPage,
    handleNextPage,
    handlePrevPage,
    currentPage,
    totalPages
}) {
    const getPageNumbers = () => {
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="w-full flex flex-wrap justify-center items-center text-base leading-5 font-medium gap-1 mt-4">
            <button
                className="px-3 py-2 bg-white rounded disabled:opacity-50 hover:opacity-85"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
            >
                <span className="">&lt;&lt;</span>
            </button>

            <button
                className="px-3 py-2 bg-white rounded disabled:opacity-50 hover:opacity-85"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
            >
                <span className="">&lt;</span>
            </button>

            {/* Ellipsis before page numbers */}
            {pageNumbers[0] > 1 && <span className="px-2">...</span>}

            {/* Page numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={`px-3 py-2 rounded ${
                        page === currentPage ? 'border-white border-2 border-solid text-white' : 'bg-white hover:opacity-85'
                    }`}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </button>
            ))}

            {/* Ellipsis after page numbers */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && <span className="px-2">...</span>}

            <button
                className="px-3 py-2 bg-white rounded disabled:opacity-50 hover:opacity-85"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                <span className="">&gt;</span>
            </button>

            <button
                className="px-3 py-2 bg-white rounded disabled:opacity-50 hover:opacity-85"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                <span className="">&gt;&gt;</span>
            </button>
        </div>
    );
}