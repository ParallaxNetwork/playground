import React from 'react'
import { Link } from 'react-router-dom'
import reactStringReplace from 'react-string-replace'
import { DateTime } from 'luxon'

export const shortAddress = (address) => {
  if (!address) return '-'
  const head = address.substring(0, 5)
  const tail = address.substring(address.length - 5)
  return head + '-' + tail
}

export const didToAddress = (did, short = false) => {
  if (!did) return ''
  const parts = did.split(':')
  return short ? shortAddress(parts[4]) : parts[4]
}

export const detailsToUsername = (details) => {
  return details?.profile?.username || shortAddress(didToAddress(details?.did))
}

export const detailsToEns = (details) => {
  return details?.metadata?.ensName || shortAddress(didToAddress(details?.did))
}

/** Regex patterns to use */
const patternMentions = /\B@[a-z0-9_.⍙-]+/gi

export const highlightMentions = (content) => {
  if (!content) return ''

  let { body } = content

  /** Get mentions in post metadata */
  const { mentions } = content

  /** Retrieve mentions in the body */
  const mentionsInBody = content.body.toString().match(patternMentions)

  /** Compare both and replace in body */
  if (mentionsInBody && mentions && Array.isArray(mentions)) {
    mentionsInBody.forEach((_m) => {
      /** Find mention with the same name */
      const mention = mentions.find((obj) => obj.username === _m)
      if (mention !== undefined) {
        body = body.replace(
          _m,
          `<span class="highlighted" contenteditable="false">${_m}</span>`
        )
      }
    })
  }

  // Replace &nbsp; with empty space
  const regexNbsp = new RegExp(String.fromCharCode(160), 'g')
  body = body.replace(regexNbsp, ' ')

  return body
}

export const formatContent = (
  content,
  hideOverflow = false,
  overflowCount = 280
) => {
  if (!content || !content.body) return null

  let _body = content.body

  if (hideOverflow && _body.length > overflowCount) {
    _body = _body.substring(0, overflowCount)
    return _body + '...'
  }

  /** Replace all <br> generated by the postbox to \n to handle line breaks */
  _body = reactStringReplace(_body, '<br>', function (match, i) {
    return <br key={match + i} />
  })

  _body = reactStringReplace(_body, '\n', function (match, i) {
    return <br key={match + i} />
  })

  /** Replace URLs */
  _body = reactStringReplace(
    _body,
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g,
    function (match, i) {
      return (
        <a
          key={match + i}
          href={match}
          rel="noreferrer"
          target="_blank"
          title={match}
          className="highlighted"
        >
          {match}
        </a>
      )
    }
  )

  /** Identify and replace mentions */

  /** Get mentions in post metadata */
  const { mentions } = content

  /** Retrieve mentions in the body */
  const mentionsInBody = content.body.toString().match(patternMentions)

  /** Compare both and replace in body */
  if (mentionsInBody && mentions && Array.isArray(mentions)) {
    mentionsInBody.forEach((_m) => {
      /** Find mention with the same name */
      const mention = mentions.find((obj) => obj.username === _m)
      if (mention !== undefined) {
        _body = reactStringReplace(_body, _m, (match, i) =>
          mention.did ? (
            <Link
              key={match + i}
              to={`/profile/${mention.did}`}
              className="highlighted"
            >
              {mention.username}
            </Link>
          ) : (
            <span className="highlighted" key={match + i}>
              {mention.username}
            </span>
          )
        )
      }
    })
  }

  // Replace &nbsp; with empty space
  const regexNbsp = new RegExp(String.fromCharCode(160), 'g')
  _body = reactStringReplace(_body, regexNbsp, function (match) {
    return ' ' + match
  })

  return _body
}

export const formatDate = (timestamp) => {
  const date = DateTime.fromSeconds(timestamp)
  const diff = date.diffNow(['days'])
  if (diff.get('days') < -2) {
    return date.toLocaleString(DateTime.DATETIME_SHORT)
  } else if (diff.get('days') < -1) {
    return 'Yesterday at ' + date.toLocaleString(DateTime.TIME_SIMPLE)
  } else {
    return 'Today at ' + date.toLocaleString(DateTime.TIME_SIMPLE)
  }
}

export const getReactions = async (orbis, streamId) => {
  if (!orbis || !streamId) return null

  const { data, error } = await orbis.api
    .from('orbis_reactions')
    .select('type')
    .eq('post_id', streamId)

  console.log({ data, error })
}

export const jsNumberForAddress = (address) => {
  var addr = address.slice(2, 10)
  var seed = parseInt(addr, 16)

  return seed
}