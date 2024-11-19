// components/shared/pagination/index.js
import React from 'react'
import styles from './index.module.scss'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5 // 只顯示最多5個頁碼

  // 計算要顯示的頁碼範圍
  const getPageNumbers = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, currentPage + halfVisible)

    // 調整範圍，使其包含5個頁碼（如果可能）
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages)
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* 起始頁和省略號 */}
      {pageNumbers[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {pageNumbers[0] > 2 && <span>...</span>}
        </>
      )}

      {/* 中間的動態頁碼 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? styles.active : ''}
        >
          {page}
        </button>
      ))}

      {/* 結束頁和省略號 */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span>...</span>
          )}
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  )
}

export default Pagination
