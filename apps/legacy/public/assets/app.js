$(function () {
  const $form = $('#book-form');
  const $message = $('#message');
  const $books = $('#books');
  const $cancelEdit = $('#cancel-edit');
  const $formTitle = $('#form-title');
  const $submitButton = $('#submit-button');

  const statusLabels = {
    want_to_read: 'Want to read',
    reading: 'Reading',
    finished: 'Finished',
  };

  loadBooks();

  $('#refresh-books').on('click', loadBooks);
  $cancelEdit.on('click', resetForm);

  $form.on('submit', function (event) {
    event.preventDefault();

    const book = readForm();
    if (!book.title || !book.author) {
      showMessage('Title and author are required.');
      return;
    }

    const id = $('#book-id').val();
    const request = {
      url: id ? `/api/books.php?id=${encodeURIComponent(id)}` : '/api/books.php',
      method: id ? 'PUT' : 'POST',
      contentType: 'application/json',
      data: JSON.stringify(book),
    };

    $.ajax(request)
      .done(function () {
        showMessage(id ? 'Book updated.' : 'Book added.', true);
        resetForm();
        loadBooks();
      })
      .fail(showAjaxError);
  });

  $books.on('click', '[data-action="edit"]', function () {
    const book = $(this).closest('.book-card').data('book');
    $('#book-id').val(book.id);
    $('#title').val(book.title);
    $('#author').val(book.author);
    $('#status').val(book.status);
    $('#rating').val(book.rating || '');
    $('#notes').val(book.notes || '');
    $formTitle.text('Edit Book');
    $submitButton.text('Update Book');
    $cancelEdit.prop('hidden', false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $books.on('click', '[data-action="delete"]', function () {
    const book = $(this).closest('.book-card').data('book');

    if (!window.confirm(`Delete "${book.title}" from the reading list?`)) {
      return;
    }

    $.ajax({
      url: `/api/books.php?id=${encodeURIComponent(book.id)}`,
      method: 'DELETE',
    })
      .done(function () {
        showMessage('Book deleted.', true);
        loadBooks();
      })
      .fail(showAjaxError);
  });

  function loadBooks() {
    $books.html('<p class="book-meta">Loading books...</p>');

    $.getJSON('/api/books.php')
      .done(function (response) {
        renderBooks(response.data || []);
      })
      .fail(showAjaxError);
  }

  function renderBooks(books) {
    if (books.length === 0) {
      $books.html('<p class="book-meta">No books yet. Add one above.</p>');
      return;
    }

    $books.empty();

    books.forEach(function (book) {
      const $card = $('<article class="book-card"></article>').data('book', book);
      const rating = book.rating ? `${book.rating}/5 stars` : 'No rating';
      const notes = book.notes ? escapeHtml(book.notes) : 'No notes yet.';

      $card.html(`
        <h3>${escapeHtml(book.title)}</h3>
        <p class="book-meta">by ${escapeHtml(book.author)}</p>
        <p class="book-meta">
          <span class="book-badge">${statusLabels[book.status] || book.status}</span>
          <span>${rating}</span>
        </p>
        <p class="book-notes">${notes}</p>
        <div class="book-actions">
          <button type="button" class="secondary" data-action="edit">Edit</button>
          <button type="button" class="danger" data-action="delete">Delete</button>
        </div>
      `);

      $books.append($card);
    });
  }

  function readForm() {
    return {
      title: $('#title').val().trim(),
      author: $('#author').val().trim(),
      status: $('#status').val(),
      rating: $('#rating').val() || null,
      notes: $('#notes').val().trim(),
    };
  }

  function resetForm() {
    $form[0].reset();
    $('#book-id').val('');
    $formTitle.text('Add a Book');
    $submitButton.text('Save Book');
    $cancelEdit.prop('hidden', true);
  }

  function showMessage(message, success) {
    $message.text(message).toggleClass('success', Boolean(success));
  }

  function showAjaxError(xhr) {
    const response = xhr.responseJSON || {};
    showMessage(response.error || 'Something went wrong. Check the API and try again.');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
});
