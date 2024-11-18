import React, { useState } from 'react'
import styles from './index.module.scss'
import Pagination from 'react-bootstrap/Pagination'

const PaginatedList = ({ data = [], itemsPerPage, renderCard }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = data.length > 0 ? Math.ceil(data.length / itemsPerPage) : 1

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  const getPaginationItems = () => {
    const paginationItems = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        )
      }
      return paginationItems
    }

    paginationItems.push(
      <Pagination.Item
        key={1}
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    )

    if (currentPage > 3) {
      paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" />)
    }

    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)

    if (currentPage <= 3) {
      startPage = 2
      endPage = 4
    }
    if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3
      endPage = totalPages - 1
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      )
    }

    if (currentPage < totalPages - 2) {
      paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" />)
    }

    paginationItems.push(
      <Pagination.Item
        key={totalPages}
        active={totalPages === currentPage}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    )

    return paginationItems
  }

  return (
    <div className={styles['pagination-container']}>
      <div>
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <React.Fragment key={item.id}>{renderCard(item)}</React.Fragment>
          ))
        ) : (
          <div>沒有可顯示的項目</div> // 當沒有項目時的提示
        )}
      </div>
      <Pagination className={styles['custom-pagination']}>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {getPaginationItems()}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  )
}

export default PaginatedList
