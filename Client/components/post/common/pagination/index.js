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
    let startPage, endPage

    if (totalPages <= 5) {
      // 如果總頁數小於或等於5，顯示所有頁碼
      startPage = 1
      endPage = totalPages
    } else {
      if (currentPage <= 3) {
        // 當前頁數在前三頁時，顯示1到5頁
        startPage = 1
        endPage = 5
      } else if (currentPage + 2 >= totalPages) {
        // 當前頁數在最後三頁時，顯示最後5頁
        startPage = totalPages - 4
        endPage = totalPages
      } else {
        // 否則，顯示當前頁及其相鄰的前兩頁和後兩頁
        startPage = currentPage - 2
        endPage = currentPage + 2
      }
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

    return paginationItems
  }

  return (
    <div className={styles['pagination-container']}>
      <div>
        {currentItems.map((item, index) => (
          <React.Fragment key={index}>{renderCard(item)}</React.Fragment>
        ))}
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
