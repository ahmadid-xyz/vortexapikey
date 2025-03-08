function viooai(content, user, prompt, imageBuffer) {
    return new Promise(async (resolve, reject) => {
      const payload = {
        content,
        user,
        prompt
      }
      if (imageBuffer) {
        payload.imageBuffer = Array.from(imageBuffer)
      }
      try {
        const response = await axios.post('https://luminai.my.id/', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        resolve(response.data.result)
      } catch (error) {
        reject(error.response ? error.response.data : error.message)
      }
    })
  }