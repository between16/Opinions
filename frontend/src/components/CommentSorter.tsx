import "./CommentSorter.css"

type CommentSorterProps = {
    onSort: (sortType: 'likes' | 'sentiment', order: 'asc' | 'desc') => void;
};

const CommentSorter: React.FC<CommentSorterProps> = ({ onSort }) => {
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [sortType, order] = e.target.value.split('-') as ['likes' | 'sentiment', 'asc' | 'desc'];
        onSort(sortType, order);
    };

    return (
        <div className="comment-sorter">
            <label htmlFor="sort-selector">Sort comments by:</label>
            <select id="sort-selector" onChange={handleSortChange}>
                <option>Choose Sorting method</option>
                <option value="likes-desc">Most likes</option>
                <option value="likes-asc">Fewest likes</option>
                <option value="sentiment-desc">Highest sentiment</option>
                <option value="sentiment-asc">Lowest sentiment</option>
            </select>
        </div>
    );
};

export default CommentSorter;
