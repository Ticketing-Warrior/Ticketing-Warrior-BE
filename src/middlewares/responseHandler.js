export function successHandler(res, message = '성공', data = null) {
    return res.status(200).json({
      success: true,
      message,
      data
    });
}