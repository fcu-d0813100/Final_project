import toast from 'react-hot-toast'

export default function useToast() {
  const showToast = (message, type = 'success') => {
    const options = {
      duration: 3000,
      style: {
        padding: '12px 40px',
        fontSize: '18px',
      },
      iconTheme: {
        primary: '#626553',
        secondary: '#fff',
      },
    }

    if (type === 'success') {
      toast.success(message, {
        ...options,
        style: {
          ...options.style,
          color: '#626553',
        },
      })
    } else if (type === 'error') {
      toast.error(message, {
        ...options,
        style: {
          ...options.style,
          color: '#963827',
        },
        iconTheme: {
          primary: '#963827',
          // secondary: '#fff',
        },
      })
    }
  }

  return showToast
}
